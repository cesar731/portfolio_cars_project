-- 1. Eliminar tablas si existen
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS user_car_gallery CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 2. Crear tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insertar roles iniciales
INSERT INTO roles (name) VALUES ('admin'), ('advisor'), ('user') ON CONFLICT (name) DO NOTHING;

-- 4. Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Crear tabla de autos
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    image_url TEXT[],
    specifications JSONB,
    fuel_type VARCHAR(50),
    mileage INTEGER,
    color VARCHAR(50),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 6. Crear tabla de accesorios
CREATE TABLE accessories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 7. Crear tabla de consultas
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    advisor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    answered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Crear tabla de galería de autos de usuarios
CREATE TABLE user_car_gallery (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    car_name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_vehicle BOOLEAN DEFAULT FALSE,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    fuel_type VARCHAR(50),
    mileage INTEGER,
    engine_spec TEXT,
    horsepower INTEGER,
    top_speed_kmh INTEGER
);

-- 9. Crear tabla de carrito de compras
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    accessory_id INTEGER REFERENCES accessories(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, accessory_id)
);

-- 10. Índices para rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_accessories_category ON accessories(category);
CREATE INDEX idx_user_car_gallery_user_id ON user_car_gallery(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- 11. Insertar usuario admin (hash bcrypt de "Secret123!")
INSERT INTO users (username, email, password_hash, role_id, is_active)
VALUES (
  'cesar_admin',
  'cesar@admin.com',
  '$2b$12$XNUCS9UrsO0ZKiKwnqw/meFZHLTA57fHEtItvC7DR5/GLy86VV6t2', 
  1,
  true
);

INSERT INTO cars (
  brand, model, year, price, description, image_url, specifications, fuel_type, mileage, color, production_years, is_published
) VALUES (
  'Ferrari',
  '250 GTO',
  1962,
  52000000,
  'Una de las piezas más codiciadas del automovilismo. Solo 36 unidades fabricadas. Ganó tres veces las 24 Horas de Le Mans.',
  '{"/images/ferrari-250.jpg"}',
  '{"engine": "V12 3.0L", "horsepower": 300, "acceleration": "4.0s", "top_speed_kmh": 280, "transmission": "4 velocidades manual", "drive_train": "Tracción trasera", "weight": "1070 kg"}',
  'Gasolina',
  NULL,
  NULL,
  '1962–1964',
  true
);


-- 13. Insertar accesorios reales
INSERT INTO accessories (
  name, description, price, image_url, category, stock, created_by, is_published
) VALUES 
('Rines Deportivos 19"', 'Rines de aleación ligera con diseño de radios deportivos.', 85000, '/images/rines.jpg', 'Rines', 10, 1, true),
('Escape Tipo Burnt Titanium', 'Escape de acero inoxidable con acabado quemado en tono titanio. Ideal para Ferraris y Porsches.', 120000, '/images/escape-titanium.jpg', 'Escapes', 8, 1, true),
('Amortiguadores Coilover Adjustable', 'Amortiguadores ajustables de alta gama con control de compresión y rebote. Compatible con Porsche 911 y Ferrari 488.', 180000, '/images/coilover.jpg', 'Amortiguadores', 5, 1, true);

-- 14. Insertar registro en galería de usuarios (auto real)
INSERT INTO user_car_gallery (
  user_id, car_name, description, image_url, is_vehicle, brand, model, year, engine_spec, horsepower, top_speed_kmh
) VALUES (
  1,
  'Ferrari 250 GTO',
  'Mi sueño hecho realidad. Este auto fue restaurado durante 3 años por mi equipo. ¡Una obra de arte sobre ruedas!',
  '/images/user-ferrari-gto.jpg',
  true,
  'Ferrari',
  '250 GTO',
  1962,
  'V12 3.0L',
  300,
  280
);

-- 15. Insertar consulta de asesoría
INSERT INTO consultations (
  user_id, advisor_id, subject, message, status
) VALUES (
  1,
  1,
  '¿Cuál es el mejor auto para uso diario?',
  'Estoy buscando un auto deportivo que también sea cómodo para ir al trabajo. ¿Qué me recomiendas?',
  'pending'
);

UPDATE users SET is_active = true WHERE is_active IS NULL;


SELECT * FROM accessories;

SELECT * FROM users;

SELECT id, name, is_published FROM accessories;


SELECT * FROM users ORDER BY created_at DESC LIMIT 5;