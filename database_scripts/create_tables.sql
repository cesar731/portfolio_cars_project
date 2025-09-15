-- ===================================================================
-- ⚠️ 1. ELIMINAR TABLAS EXISTENTES (EN ORDEN INVERSO A LAS DEPENDENCIAS)
-- ===================================================================
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS user_car_gallery CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ===================================================================
-- ✅ 2. CREAR TABLA DE ROLES (PRIMERA, PORQUE OTRAS LA REFERENCIAN)
-- ===================================================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar roles iniciales
INSERT INTO roles (name) VALUES ('admin'), ('advisor'), ('user') ON CONFLICT (name) DO NOTHING;

-- ===================================================================
-- ✅ 3. CREAR TABLA DE USUARIOS
-- ===================================================================
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

-- ===================================================================
-- ✅ 4. CREAR TABLA DE AUTOS (CON TODAS LAS COLUMNAS NECESARIAS)
-- ===================================================================
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
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- ✅ NUEVAS COLUMNAS AÑADIDAS PARA COMPATIBILIDAD CON EL BACKEND
    engine VARCHAR(50),
    horsepower INTEGER,
    top_speed INTEGER,
    transmission VARCHAR(100),
    drive_train VARCHAR(100),
    weight VARCHAR(20),
    production_years VARCHAR(20)
);

-- ===================================================================
-- ✅ 5. CREAR TABLA DE ACCESORIOS
-- ===================================================================
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

-- ===================================================================
-- ✅ 6. CREAR TABLA DE CONSULTAS
-- ===================================================================
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

-- ===================================================================
-- ✅ 7. CREAR TABLA DE GALERÍA DE USUARIOS
-- ===================================================================
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

-- ===================================================================
-- ✅ 8. CREAR TABLA DE CARRITO DE COMPRAS
-- ===================================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    accessory_id INTEGER REFERENCES accessories(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, accessory_id)
);

-- ===================================================================
-- ✅ 9. ÍNDICES PARA RENDIMIENTO
-- ===================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_accessories_category ON accessories(category);
CREATE INDEX idx_user_car_gallery_user_id ON user_car_gallery(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ===================================================================
-- ✅ 10. INSERTAR DATOS DE EJEMPLO (¡CRUCIAL PARA QUE TU FRONTEND MUESTRE CONTENIDO!)
-- ===================================================================

-- Insertar usuario admin (hash bcrypt de "Secret123!")
INSERT INTO users (username, email, password_hash, role_id, is_active)
VALUES (
  'cesar_admin',
  'cesar@example.com',
  '$2b$10$eJfHjDqVzvQgXkGpZcKw4uYdRmNlPqWtSvXrYzAaBbCcDdEeFfGgHhIiJj',
  1,
  true
);

-- Insertar autos con todas las nuevas columnas
INSERT INTO cars (
  brand, model, year, price, description, image_url, engine, horsepower, top_speed, transmission, drive_train, weight, fuel_type, production_years, is_published
) VALUES (
  'Ferrari',
  '250 GTO',
  1962,
  52000000,
  'Una de las piezas más codiciadas del automovilismo. Solo 36 unidades fabricadas. Ganó tres veces las 24 Horas de Le Mans.',
  '{"/images/ferrari-250.jpg"}',
  'V12 3.0L',
  300,
  280,
  '4 velocidades manual',
  'Tracción trasera',
  '1070 kg',
  'Gasolina',
  '1962–1964',
  true
);

INSERT INTO cars (
  brand, model, year, price, description, image_url, engine, horsepower, top_speed, transmission, drive_train, weight, fuel_type, production_years, is_published
) VALUES (
  'Porsche',
  '911 GT3 RS',
  2023,
  280000,
  'La versión más pura y deportiva de la leyenda 911. Diseñada para circuito, con aerodinámica extrema y motor naturalmente aspirado.',
  '{"/images/porsche-911.jpg"}',
  'Flat-6 4.0L',
  510,
  320,
  'PDK de 8 velocidades',
  'Tracción trasera',
  '1420 kg',
  'Gasolina',
  '2023–presente',
  true
);

INSERT INTO cars (
  brand, model, year, price, description, image_url, engine, horsepower, top_speed, transmission, drive_train, weight, fuel_type, production_years, is_published
) VALUES (
  'Lamborghini',
  'Miura',
  1966,
  45000000,
  'El primer superdeportivo con motor central-trasero. Revolucionó el diseño de los deportivos modernos.',
  '{"/images/lamborghini-miura.jpg"}',
  'V12 4.0L',
  350,
  290,
  '5 velocidades manual',
  'Tracción trasera',
  '1280 kg',
  'Gasolina',
  '1966–1973',
  true
);

-- Insertar accesorios
INSERT INTO accessories (
  name, description, price, image_url, category, stock, created_by, is_published
) VALUES (
  'Rines Deportivos 19"',
  'Rines de aleación ligera con diseño de radios deportivos.',
  85000,
  '/images/rines.jpg',
  'Rines',
  10,
  1,
  true
);

INSERT INTO accessories (
  name, description, price, image_url, category, stock, created_by, is_published
) VALUES (
  'Escape Tipo Burnt Titanium',
  'Escape de acero inoxidable con acabado quemado en tono titanio. Ideal para Ferraris y Porsches.',
  120000,
  '/images/escape-titanium.jpg',
  'Escapes',
  8,
  1,
  true
);

INSERT INTO accessories (
  name, description, price, image_url, category, stock, created_by, is_published
) VALUES (
  'Amortiguadores Coilover Adjustable',
  'Amortiguadores ajustables de alta gama con control de compresión y rebote. Compatible con Porsche 911 y Ferrari 488.',
  180000,
  '/images/coilover.jpg',
  'Amortiguadores',
  5,
  1,
  true
);

-- Insertar publicaciones en galería de usuarios
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

INSERT INTO user_car_gallery (
  user_id, car_name, description, image_url, is_vehicle
) VALUES (
  1,
  'Mi primera moto',
  'Esta es mi moto de 2018. No es un auto, pero me encanta compartirla.',
  '/images/user-moto.jpg',
  false
);

-- Insertar consulta de asesoría
INSERT INTO consultations (
  user_id, advisor_id, subject, message, status
) VALUES (
  1,
  1,
  '¿Cuál es el mejor auto para uso diario?',
  'Estoy buscando un auto deportivo que también sea cómodo para ir al trabajo. ¿Qué me recomiendas?',
  'pending'
);