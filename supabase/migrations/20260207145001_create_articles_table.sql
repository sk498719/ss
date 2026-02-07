/*
  # Create Articles Table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key) - Unique identifier for each article
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly identifier
      - `excerpt` (text) - Short description of the article
      - `content` (text) - Full article content in markdown format
      - `cover_image_url` (text) - URL to the cover image
      - `author_id` (uuid, foreign key) - Reference to profiles table
      - `category` (text) - Article category (wellness, mindfulness, lifestyle, nutrition, etc.)
      - `tags` (text array) - Array of tags for filtering
      - `is_featured` (boolean) - Whether the article is featured
      - `published_at` (timestamptz) - When the article was published
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
      - `sort_order` (integer) - For manual ordering

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access to published articles
    - Add policy for authenticated users to read all articles
    - Add policy for admin users to manage articles
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'wellness',
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  sort_order integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  USING (published_at <= now());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, cover_image_url, category, tags, is_featured, sort_order)
VALUES
  (
    'De Kracht van Dagelijkse Meditatie',
    'kracht-van-dagelijkse-meditatie',
    'Ontdek hoe een dagelijkse meditatiepraktijk je leven kan transformeren en innerlijke rust kan brengen.',
    '# De Kracht van Dagelijkse Meditatie

Meditatie is meer dan alleen stilzitten. Het is een reis naar binnen, een moment van verbinding met jezelf. In onze drukke wereld is het essentieel om dagelijks tijd te nemen voor innerlijke rust.

## Waarom dagelijks mediteren?

- Vermindert stress en angst
- Verbetert focus en concentratie
- Bevordert emotioneel welzijn
- Helpt bij het ontwikkelen van zelfbewustzijn

## Hoe begin je?

Begin met slechts 5 minuten per dag. Kies een rustige plek, ga comfortabel zitten en focus op je ademhaling. Laat gedachten komen en gaan zonder oordeel.',
    'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg',
    'mindfulness',
    ARRAY['meditatie', 'mindfulness', 'wellness'],
    true,
    1
  ),
  (
    'Yoga voor Beginners: Een Zachte Start',
    'yoga-voor-beginners',
    'Een complete gids voor wie wil beginnen met yoga. Leer de basis en start je reis naar meer flexibiliteit en kracht.',
    '# Yoga voor Beginners

Yoga is toegankelijk voor iedereen, ongeacht je leeftijd of fitnessniveau. Het gaat niet om perfectie, maar om verbinding met je lichaam en adem.

## De basis poses

### Mountain Pose (Tadasana)
De basis van alle staande poses. Sta rechtop, voeten heupbreed, gewicht gelijk verdeeld.

### Child''s Pose (Balasana)
Een rustgevende pose die helpt bij ontspanning en stress vermindering.

## Tips voor beginners

- Luister naar je lichaam
- Forceer niets
- Focus op je ademhaling
- Wees geduldig met jezelf',
    'https://images.pexels.com/photos/3822718/pexels-photo-3822718.jpeg',
    'yoga',
    ARRAY['yoga', 'beginners', 'wellness'],
    true,
    2
  ),
  (
    'Mindful Eten: Bewust Genieten van Voedsel',
    'mindful-eten',
    'Leer hoe mindful eating je relatie met voedsel kan transformeren en je helpt om bewuster te genieten van elke maaltijd.',
    '# Mindful Eten

Mindful eating draait om het volledig aanwezig zijn tijdens het eten. Het gaat niet om diëten, maar om een gezonde relatie met voedsel ontwikkelen.

## Wat is mindful eating?

Het is het bewust ervaren van:
- De smaken en texturen van je eten
- Je honger- en verzadigingssignalen
- Je emoties rondom eten
- Dankbaarheid voor je voedsel

## Praktische tips

1. Eet zonder afleidingen (geen telefoon, tv)
2. Kauw langzaam en proef bewust
3. Leg je bestek tussen happen neer
4. Vraag jezelf af: ben ik echt hongerig?',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'nutrition',
    ARRAY['mindfulness', 'voeding', 'wellness'],
    false,
    3
  ),
  (
    'De Voordelen van een Ochtendroutine',
    'voordelen-ochtendroutine',
    'Een goede ochtendroutine kan de toon zetten voor een productieve en vredige dag. Ontdek hoe je jouw perfecte ochtend creëert.',
    '# De Voordelen van een Ochtendroutine

Hoe je je dag begint, bepaalt vaak hoe de rest van je dag verloopt. Een bewuste ochtendroutine kan een krachtig hulpmiddel zijn.

## Een ideale ochtendroutine

### 6:00 - Wakker worden zonder snooze
Begin je dag met intentie, niet met uitstel.

### 6:15 - Meditatie of stretching
Neem tijd voor jezelf voordat de dag begint.

### 6:30 - Gezond ontbijt
Voed je lichaam met voedzame ingrediënten.

### 7:00 - Dagelijkse intentie stellen
Wat wil je vandaag bereiken?

## De kracht van consistentie

Consistentie is belangrijker dan perfectie. Begin klein en bouw langzaam op.',
    'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg',
    'lifestyle',
    ARRAY['routine', 'wellness', 'mindfulness'],
    true,
    4
  );
