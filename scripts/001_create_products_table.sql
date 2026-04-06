-- Create the products table for the luxury catalogue
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  origin_country TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  variants TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can only SELECT visible products
CREATE POLICY "Public can view visible products" ON products
  FOR SELECT
  USING (is_visible = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users can also view all products (including hidden ones)
CREATE POLICY "Authenticated users can view all products" ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;
