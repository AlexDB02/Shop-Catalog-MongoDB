![enter image description here](https://web.gcompostela.org/wp-content/uploads/2022/10/Universidad-La-DeLa-Salle-Bajio-logo.png)
# Tiendas de ropa
## Proyecto final de sistemas geo-referenciados.

### Integrantes:
* Becerra Díaz Alejandro.
* González Hernández Juan Pablo.
* Núñez Guerrero Melanie Guadalupe.
* Peña Bravo María Cecilia.
* Trujillo Ramírez César Andrés.
### Profesor Frausto Ramírez Juan de Dios.
#### 11/12/2024.
##### Ingeniería de Software y Sistemas Computacionales - 712.

Aquí está el índice basado en el contenido del `README.md`:

---

## **Índice**

1. [Introducción](#Tiendas-de-ropa)  
2. [Descripción de la Aplicación](#descripción-de-la-aplicación)  
3. [Tecnologías Usadas y Prerrequisitos](#tecnologías-usadas-y-prerrequisitos)  
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)  
5. [Ejecutar el Proyecto con Docker](#ejecutar-el-proyecto-con-docker)  
6. [Estructura del Proyecto](#estructura-del-proyecto)  
7. [Roles en la Aplicación](#roles-en-la-aplicación)  
   - [Usuarios Clientes](#usuarios-clientes)  
   - [Administradores](#administradores)  
8. [Tabla Comparativa de Roles](#tabla-comparativa-de-roles)  
9. [Modelo de Datos](#modelo-de-datos)  
   - [Entidad Usuario](#entidad-usuario)  
   - [Entidad Categoría](#entidad-categoría)  
   - [Entidad Tienda](#entidad-tienda)  
   - [Entidad Sucursal](#entidad-sucursal)  
   - [Entidad Producto](#entidad-producto)  
10. [Relaciones](#relaciones)  
11. [Endpoints Generales para Postman](#endpoints-generales-para-postman)  
   - [Categorías](#categorías)  
   - [Tiendas](#tiendas)  
   - [Sucursales](#sucursales)  
   - [Productos](#productos)  
   - [Usuarios](#usuarios)  
12. [Endpoints de Búsqueda con Filtros](#endpoints-de-búsqueda-con-filtros)  
13. [Conexión entre los Filtros y Detalles](#conexión-entre-los-filtros-y-detalles)  
14. [Pantallas de Flutter por Entidad](#pantallas-de-flutter-por-entidad)  
   - [Categorías](#categorías-1)  
   - [Tiendas](#tiendas-1)  
   - [Sucursales](#sucursales-1)  
   - [Productos](#productos-1)  
   - [Usuarios](#usuarios-1)  
15. [Flujo de Interacción con Pantallas](#flujo-de-interacción-con-pantallas)  
16. [Desambiguación de Requisitos Funcionales](#desambiguación-de-requisitos-funcionales)  
17. [Resumen](#resumen)

---

### **Descripción de la Aplicación**

La aplicación es un catálogo móvil que permite a los usuarios explorar tiendas de ropa organizadas por categorías de estilo. Proporciona funcionalidades para localizar sucursales en un mapa, explorar catálogos de productos, y gestionar perfiles de usuario. Los administradores tienen acceso completo a herramientas para gestionar categorías, tiendas, sucursales y productos.

---

### **Tecnologías Usadas y Prerrequisitos**

El proyecto utiliza las siguientes tecnologías:
- **Node.js**: Para construir la API RESTful.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar categorías, tiendas, sucursales, productos y usuarios.
- **Docker**: Contenerización de la aplicación para facilitar la implementación.
- **Postman**: Herramienta para probar los endpoints de la API.
- **Express.js**: Framework para gestionar las rutas y lógica del backend.

---

### **Configuración de Variables de Entorno**

Las siguientes variables de entorno son necesarias para ejecutar la aplicación:

| **Variable**               | **Descripción**                                             |
|----------------------------|-----------------------------------------------------------|
| `PORT`                     | Puerto en el que se ejecutará la API (por defecto `3000`). |
| `MONGODB_URI`              | URL de conexión a la base de datos MongoDB.                |
| `EMAIL_SERVICE`            | Proveedor de servicio de email (por ejemplo, `gmail`).     |
| `EMAIL_USER`               | Usuario del servicio de email.                             |
| `EMAIL_PASS`               | Contraseña del servicio de email.                          |
| `MONGO_INITDB_ROOT_USERNAME` | Usuario root de la base de datos MongoDB.                |
| `MONGO_INITDB_ROOT_PASSWORD` | Contraseña root de la base de datos MongoDB.             |

---

### **Ejecutar el Proyecto con Docker**

1. **Requisitos previos:**
   - Asegúrate de tener Docker instalado en tu sistema.

2. **Construir la imagen:**
   ```bash
   docker build -t shop-catalog-api .
   ```

3. **Ejecutar el contenedor:**
   ```bash
   docker run -d -p 3000:3000 --name shop-catalog-api --env-file .env shop-catalog-api
   ```

4. **Variables de entorno en Docker:**
   - Asegúrate de definir todas las variables necesarias en un archivo `.env` en el mismo directorio que `docker-compose.yml`.

5. **Comandos adicionales:**
   - **Detener el contenedor:**
     ```bash
     docker stop shop-catalog-api
     ```
   - **Eliminar el contenedor:**
     ```bash
     docker rm shop-catalog-api
     ```

---

### **Estructura del Proyecto**

El proyecto está organizado de la siguiente manera:
```
/controllers
/models
/routes
/utils
.env
docker-compose.yml
package.json
```

### **Roles en la Aplicación**

1. **Usuarios Clientes:**
   - **Permisos:**
     - Consultar categorías, tiendas, sucursales y productos.
     - CRUD completo sobre su propio perfil:
       - Crear, consultar, actualizar y eliminar su cuenta.
   - **Registro:** 
     - Los usuarios se registran directamente desde la aplicación móvil.
   - **Restricciones:**
     - No pueden realizar cambios en las categorías, tiendas, sucursales o productos.
     - No tienen acceso a funcionalidades administrativas ni a la gestión de otros usuarios.

2. **Administradores:**
   - **Permisos:**
     - CRUD completo de todas las entidades:
       - Categorías, tiendas, sucursales y productos.
       - Usuarios: Listar, consultar y eliminar usuarios si es necesario.
   - **Registro:** 
     - Administradores registrados desde el código o por el equipo de desarrollo.
   - **Restricciones:**
     - No pueden registrarse ni editar su propio rol como administrador.
     - Solo pueden operar dentro del alcance del sistema (sin acceso a datos protegidos externos).

---

### **Tabla Comparativa de Roles**

| **Funcionalidad**            | **Usuario Cliente** | **Administrador** |
|------------------------------|---------------------|-------------------|
| Consultar categorías         | ✔️                  | ✔️               |
| Consultar tiendas            | ✔️                  | ✔️               |
| Consultar sucursales         | ✔️                  | ✔️               |
| Consultar productos          | ✔️                  | ✔️               |
| CRUD sobre perfil propio     | ✔️                  | ✔️               |
| CRUD sobre categorías        | ❌                  | ✔️               |
| CRUD sobre tiendas           | ❌                  | ✔️               |
| CRUD sobre sucursales        | ❌                  | ✔️               |
| CRUD sobre productos         | ❌                  | ✔️               |
| Gestión de usuarios          | ❌                  | ✔️ (listar, consultar, eliminar) |

---

### **Modelo de Datos**

#### **Entidad Usuario**
- `id`: UUID (Llave primaria).  
- `email`: String.  
- `password`: String.  
- `name`: String.  
- `role`: Enum (`cliente`, `administrador`).  
- `image`: String (URL de imagen de perfil).  

#### **Entidad Categoría**
- `id`: UUID (Llave primaria).  
- `name`: String.  
- `description`: String.  
- `image`: String (URL de imagen representativa).  

#### **Entidad Tienda**
- `id`: UUID (Llave primaria).  
- `name`: String.  
- `description`: String.  
- `category_id`: UUID (Llave foránea a `Categoría`).  
- `main_address`: String.  
- `main_phone`: String.  
- `website`: String.  
- `image`: String (URL de imagen).  

#### **Entidad Sucursal**
- `id`: UUID (Llave primaria).  
- `store_id`: UUID (Llave foránea a `Tienda`).  
- `name`: String.  
- `address`: String.  
- `latitude`: Float.  
- `longitude`: Float.  
- `services`: Array[String].  
- `horarios`: JSON (Objeto que especifica los horarios de apertura y cierre por día).
- `image`: String (URL de imagen).  

##### **Ejemplo de Atributo Horarios en JSON**
```json
{
  "horarios": {
    "lunes": { "apertura": "09:00", "cierre": "18:00" },
    "martes": { "apertura": "09:00", "cierre": "18:00" },
    "miércoles": { "apertura": "09:00", "cierre": "18:00" },
    "jueves": { "apertura": "09:00", "cierre": "18:00" },
    "viernes": { "apertura": "09:00", "cierre": "18:00" },
    "sábado": { "apertura": "10:00", "cierre": "14:00" },
    "domingo": null
  }
}
```
#### **Entidad Producto**
- `id`: UUID (Llave primaria).  
- `store_id`: UUID (Llave foránea a `Tienda`).  
- `name`: String.  
- `description`: String.  
- `price`: Float.  
- `image`: String (URL de imagen).  

---

### **Relaciones**
1. **Categoría - Tiendas:** Una categoría tiene varias tiendas (`category_id`).  
2. **Tienda - Sucursales:** Una tienda tiene varias sucursales (`store_id`).  
3. **Tienda - Productos:** Una tienda tiene varios productos (`store_id`).  

---

### **Endpoints Generales para Postman**

#### **Categorías**
1. **Listar todas las categorías:**  
   - **GET** `/categories`  
2. **Consultar una categoría específica:**  
   - **GET** `/categories/:id`  
3. **Crear nueva categoría:**  
   - **POST** `/categories` (Solo administrador).  
4. **Actualizar una categoría:**  
   - **PUT** `/categories/:id` (Solo administrador).  
5. **Eliminar una categoría:**  
   - **DELETE** `/categories/:id` (Solo administrador).  

#### **Tiendas**
1. **Listar todas las tiendas:**  
   - **GET** `/stores`  
2. **Listar tiendas por categoría:**  
   - **GET** `/categories/:id/stores`  
3. **Consultar detalles de una tienda específica:**  
   - **GET** `/stores/:id`  
4. **Crear una nueva tienda:**  
   - **POST** `/stores` (Solo administrador).  
5. **Actualizar una tienda:**  
   - **PUT** `/stores/:id` (Solo administrador).  
6. **Eliminar una tienda:**  
   - **DELETE** `/stores/:id` (Solo administrador).  

#### **Sucursales**
1. **Listar todas las sucursales:**  
   - **GET** `/branches`  
2. **Listar sucursales de una tienda específica:**  
   - **GET** `/stores/:id/branches`  
3. **Consultar detalles de una sucursal específica:**  
   - **GET** `/branches/:id`  
4. **Crear una nueva sucursal:**  
   - **POST** `/branches` (Solo administrador).  
5. **Actualizar una sucursal:**  
   - **PUT** `/branches/:id` (Solo administrador).  
6. **Eliminar una sucursal:**  
   - **DELETE** `/branches/:id` (Solo administrador).  

#### **Productos**
1. **Listar todos los productos:**  
   - **GET** `/products`  
2. **Listar productos de una tienda específica:**  
   - **GET** `/stores/:id/products`  
3. **Consultar detalles de un producto específico:**  
   - **GET** `/products/:id`  
4. **Crear un nuevo producto:**  
   - **POST** `/products` (Solo administrador).  
5. **Actualizar un producto:**  
   - **PUT** `/products/:id` (Solo administrador).  
6. **Eliminar un producto:**  
   - **DELETE** `/products/:id` (Solo administrador).  

#### **Usuarios**
1. **Registrar un nuevo usuario:**  
   - **POST** `/users/register`  
2. **Consultar detalles de la cuenta del usuario:**  
   - **GET** `/users/me`  
3. **Actualizar detalles de la cuenta del usuario:**  
   - **PUT** `/users/me`  
4. **Eliminar cuenta del usuario:**  
   - **DELETE** `/users/me`  
5. **Listar todos los usuarios:**  
   - **GET** `/users` (Solo administrador).  
6. **Consultar detalles de un usuario específico:**  
   - **GET** `/users/:id` (Solo administrador).  

---

### **Endpoints de Búsqueda con Filtros**

1. **Listar todo (tiendas, sucursales y productos):**  
   - **GET** `/search?type=<type>&query=<query>`  
     Este endpoint permite filtrar por tipo (`stores`, `branches`, `products`) y un criterio de búsqueda (`query`).

   **Ejemplo de uso:**
   - `/search?type=stores&query=H&M`: Devuelve todas las tiendas con el nombre "H&M".  
   - `/search?type=branches&query=Blvd.`: Devuelve sucursales que incluyan "Blvd." en su dirección.  
   - `/search?type=products&query=camisa`: Devuelve productos que incluyan "camisa" en su nombre.  

2. **Consultar detalles del resultado seleccionado:**  
   - **GET** `/search/:id`  
     Devuelve el detalle del elemento seleccionado (ya sea tienda, sucursal o producto).  

---

### **Conexión entre los Filtros y Detalles**

Cuando un usuario realiza una consulta utilizando el endpoint de búsqueda general (`/search`), las tarjetas (cards) mostradas estarán relacionadas con los resultados filtrados. Las tarjetas actuarán como enlaces a los detalles correspondientes, dependiendo del tipo de resultado.

- **Redirección según el tipo de resultado:**
  - **Si es una tienda:**  
    - Redirige al endpoint `/stores/:id` donde se muestran los detalles de la tienda, su catálogo y sucursales.
  - **Si es una sucursal:**  
    - Redirige al endpoint `/branches/:id` para ver detalles de ubicación, servicios y horario.
  - **Si es un producto:**  
    - Redirige al endpoint `/products/:id` donde se muestra su descripción, precio y detalles de la tienda asociada.

- **Interacción con las tarjetas:**
  - Cada tarjeta incluye un botón o evento táctil que realiza la redirección automáticamente.
  - Los detalles mostrados dependen del tipo de entidad seleccionada.

- **Ejemplo Práctico de Flujo:**
  - **Caso 1:**  
    - Un usuario busca "H&M" y selecciona una tarjeta de tienda.
    - Es redirigido a `/stores/:id` donde puede ver el catálogo y sucursales.
  - **Caso 2:**  
    - Un usuario busca "Blvd." y selecciona una tarjeta de sucursal.
    - Es redirigido a `/branches/:id` para consultar la ubicación exacta.
  - **Caso 3:**  
    - Un usuario busca "camisa" y selecciona una tarjeta de producto.
    - Es redirigido a `/products/:id` para consultar la descripción y el precio.

---

### **Pantallas de Flutter por Entidad**

#### **Categorías**
1. **Pantalla de Listado de Categorías:**  
   - Cards que muestran ícono, nombre y descripción.  
   - **Botones:** Crear, editar o eliminar categorías (solo administradores).

2. **Pantalla de Formulario de Categoría:**  -Solo administrador.-
   - Para crear y editar categorías.  
   - **Campos:** Nombre, descripción e imagen.  

---

#### **Tiendas**
1. **Pantalla de Listado de Tiendas:**  
   - Cards con nombre, categoría y dirección. Pueden incluir datos calculados a estilo dashboard como número de sucursales.
   - **Botones:** Crear, editar o eliminar tiendas (solo administradores).  

2. **Pantalla de Detalle de Tienda:**  
   - Muestra información detallada de la tienda.  
   - Incluye botones para acceder al catálogo de productos y sucursales.

3. **Pantalla de Formulario de Tienda:**  -Solo administrador.-
   - Para crear y editar tiendas.  
   - **Campos:** Nombre, categoría, dirección principal, teléfono, imagen y sitio web.  

---

#### **Sucursales**
1. **Pantalla de Listado de Sucursales:**  
   - Cards con nombre, dirección y estado.  
   - **Botones:** Crear, editar o eliminar sucursales (solo administradores).  

2. **Pantalla de Detalle de Sucursal:**  
   - Muestra detalles de ubicación, servicios y horarios.  
   - Incluye mapa interactivo con su localización.  

3. **Pantalla de Formulario de Sucursal:**  -Solo administrador.-
   - Para crear y editar sucursales.  
   - **Campos:** Nombre, dirección, latitud, longitud, servicios e imagen.  

---

#### **Productos**
1. **Pantalla de Listado de Productos:**  
   - Cards con nombre, precio y descripción.  
   - **Botones:** Crear, editar o eliminar productos (solo administradores).  

2. **Pantalla de Detalle de Producto:**  
   - Detalles del producto seleccionado, como descripción, precio y tienda asociada.  

3. **Pantalla de Formulario de Producto:**  -Solo administrador.-
   - Para crear y editar productos.  
   - **Campos:** Nombre, precio, descripción, imagen y tienda asociada.  

---

#### **Usuarios**
1. **Pantalla de Registro:**  
   - Formulario para crear una cuenta nueva con email, contraseña y nombre.  

2. **Pantalla de Perfil:**  
   - Datos del usuario con opción para editar o eliminar cuenta.  

---

### **Flujo de Interacción con Pantallas**

1. **Categoría seleccionada:**  
   - Usuario selecciona una categoría de la pantalla de listado, lo que lo lleva a las tiendas relacionadas.  

2. **Tienda seleccionada:**  
   - Usuario selecciona una tienda y accede al detalle de la tienda, donde puede elegir entre catálogo de productos o sucursales.

3. **Producto o sucursal seleccionada:**  
   - Usuario selecciona un producto o una sucursal y accede al detalle correspondiente (descripción del producto o ubicación de la sucursal).

---

### **Desambiguación de requisitos funcionales**

1. Consultar y listar todas las categorías.  
2. Ver detalles de una categoría, incluyendo sus tiendas asociadas.  
3. Crear, editar y eliminar categorías (solo administradores).  
4. Consultar y listar todas las tiendas.  
5. Filtrar tiendas por categoría seleccionada.  
6. Ver detalles de una tienda, incluyendo descripción, catálogo y sucursales.  
7. Crear, editar y eliminar tiendas (solo administradores).  
8. Consultar y listar todas las sucursales.  
9. Ver detalles de una sucursal, incluyendo ubicación, servicios y horarios.  
10. Crear, editar y eliminar sucursales (solo administradores).  
11. Consultar y listar todos los productos.  
12. Filtrar productos por tienda seleccionada.  
13. Ver detalles de un producto, como nombre, precio y descripción.  
14. Crear, editar y eliminar productos (solo administradores).  
15. Registrar, editar y eliminar perfiles de usuario (clientes sobre su propio perfil).  
16. Consultar, listar y eliminar usuarios (solo administradores).  
17. Realizar búsquedas generales con filtros por tiendas, sucursales o productos.  
18. Redirigir tarjetas de búsqueda a los detalles de la entidad seleccionada.  
19. Navegar de categorías a tiendas, sucursales y productos de forma jerárquica.  
20. Mostrar ubicaciones de sucursales en un mapa interactivo.  
21. Diseñar pantallas **(mínimo 4)** intuitivas para cada entidad y función del sistema.

---

### **Resumen**

La aplicación funciona como un directorio de tiendas de ropa organizado por categorías de estilo. Los usuarios pueden explorar todas las tiendas locales que ofrecen un estilo específico. Al seleccionar una tienda, se muestra información detallada sobre la misma, incluyendo su ubicación geográfica, catálogo de productos y un botón para ver las sucursales disponibles. Por ejemplo, si el usuario selecciona la categoría "Old Money", podrá ver tiendas como Zara, Bershka y H&M. Al presionar Zara, se despliega su catálogo y un acceso a la lista de sucursales. Al seleccionar una sucursal, se muestran detalles específicos como su ubicación exacta.

---
