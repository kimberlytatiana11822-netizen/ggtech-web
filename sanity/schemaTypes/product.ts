import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Nombre completo (detalle)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'shortName',
      title: 'Nombre corto (página principal)',
      type: 'string',
      description: 'Si se deja vacío, se usa el nombre completo',
    }),

    defineField({
      name: 'price',
      title: 'Precio actual',
      type: 'number',
      validation: (Rule) =>
        Rule.required().min(0),
    }),

    defineField({
      name: 'oldPrice',
      title: 'Precio anterior (tachado)',
      type: 'number',
      description: 'Opcional. Si querés mostrar el precio rebajado, poné acá el precio viejo (ej: 400) y en "Precio actual" el nuevo (ej: 300).',
      validation: (Rule) =>
        Rule.min(0),
    }),

    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'images',
      title: 'Galería de imágenes (máximo 5)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
      options: {
        layout: 'grid',
      },
    }),

    defineField({
      name: 'description',
      title: 'Descripción completa (detalle)',
      type: 'text',
      rows: 5,
    }),

    defineField({
      name: 'shortDescription',
      title: 'Descripción corta (página principal)',
      type: 'text',
      rows: 2,
      description: 'Si se deja vacío, se usa la descripción completa',
    }),

    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Electrónica', value: 'electronica' },
          { title: 'Computadoras', value: 'computadoras' },
          { title: 'Periféricos', value: 'perifericos' },
          { title: 'Accesorios', value: 'accesorios' },
          { title: 'Gaming', value: 'gaming' },
          { title: 'Hogar', value: 'hogar' },
          { title: 'Cocina', value: 'cocina' },
          { title: 'Belleza', value: 'belleza' },
          { title: 'Otros', value: 'otros' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'stock',
      title: 'Stock disponible',
      type: 'number',
      validation: (Rule) =>
        Rule.min(0),
    }),

    defineField({
      name: 'hasColors',
      title: 'Tiene colores para elegir',
      type: 'boolean',
      description: 'Si se activa, aparece el selector de color en la página del producto (arriba del botón de WhatsApp)',
      initialValue: false,
    }),

    defineField({
      name: 'colors',
      title: 'Colores disponibles',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Elegí los colores que el cliente puede seleccionar',
      options: {
        list: [
          { title: 'Blanco', value: 'blanco' },
          { title: 'Negro', value: 'negro' },
          { title: 'Gris', value: 'gris' },
          { title: 'Rojo', value: 'rojo' },
          { title: 'Rosa', value: 'rosa' },
          { title: 'Celeste', value: 'celeste' },
          { title: 'Azul', value: 'azul' },
          { title: 'Verde', value: 'verde' },
          { title: 'Amarillo', value: 'amarillo' },
          { title: 'Lila', value: 'lila' },
          { title: 'Naranja', value: 'naranja' },
          { title: 'Marrón', value: 'marron' },
          { title: 'Bordo', value: 'bordo' },
          { title: 'Dorado', value: 'dorado' },
          { title: 'Plateado', value: 'plateado' },
        ],
      },
    }),

    defineField({
      name: 'featured',
      title: 'Producto destacado',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'category',
    },
  },
})