/**
 * Script para verificar si las columnas extendidas existen en la tabla workers
 * Ejecutar con: node scripts/check-worker-columns.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumns() {
  console.log('🔍 Verificando columnas de la tabla workers...\n')

  try {
    // Intentar seleccionar todos los campos incluyendo los nuevos
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error al consultar la tabla:', error.message)
      return
    }

    if (!data || data.length === 0) {
      console.log('⚠️  La tabla workers está vacía, pero podemos verificar su estructura')
      const { data: emptyData, error: emptyError } = await supabase
        .from('workers')
        .select('*')
        .limit(0)

      if (emptyError) {
        console.error('❌ Error:', emptyError.message)
        return
      }
    }

    const expectedColumns = [
      // Campos básicos
      'id', 'dni', 'full_name', 'phone', 'email', 'position', 'company_id', 'status', 'photo_url',
      // Información Personal Extendida
      'pais', 'sexo', 'estado_civil', 'fecha_nacimiento', 'correo_personal', 'domicilio', 'telefono_fijo',
      // Información Profesional Extendida
      'carrera_profesional', 'fecha_inicio', 'fecha_cese', 'sitio', 'area', 'local', 'condiciones_trabajo',
      // Metadata
      'created_at', 'updated_at'
    ]

    console.log('📋 Columnas esperadas:')
    console.log('─'.repeat(50))

    const sampleRow = data && data.length > 0 ? data[0] : {}
    const existingColumns = Object.keys(sampleRow)

    let missingColumns = []
    let foundColumns = []

    expectedColumns.forEach(col => {
      if (existingColumns.includes(col)) {
        console.log(`  ✅ ${col}`)
        foundColumns.push(col)
      } else {
        console.log(`  ❌ ${col} (FALTA)`)
        missingColumns.push(col)
      }
    })

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Columnas encontradas: ${foundColumns.length}/${expectedColumns.length}`)

    if (missingColumns.length > 0) {
      console.log(`\n❌ FALTAN ${missingColumns.length} COLUMNAS:`)
      console.log('─'.repeat(50))
      missingColumns.forEach(col => console.log(`  • ${col}`))
      console.log('\n📝 ACCIÓN NECESARIA:')
      console.log('   Debes ejecutar la migración SQL en Supabase:')
      console.log('   1. Abre https://supabase.com/dashboard/project/[tu-proyecto]/editor')
      console.log('   2. Ve a SQL Editor')
      console.log('   3. Copia y ejecuta el contenido de:')
      console.log('      supabase/migrations/01-add-worker-extended-fields.sql')
    } else {
      console.log('\n✅ ¡Todas las columnas están presentes!')
      console.log('   La tabla workers tiene todos los campos necesarios.')
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error)
  }
}

checkColumns()
