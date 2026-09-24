<#
.SYNOPSIS
  Gera dist/curso-scorm.zip com o conteúdo da pasta curso/ na raiz do pacote,
  pronto para importar no LMS.
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$raiz = Split-Path -Parent $PSScriptRoot
$origem = Join-Path $raiz 'curso'
$destino = Join-Path $raiz 'dist'
$pacote = Join-Path $destino 'curso-scorm.zip'

New-Item -ItemType Directory -Force -Path $destino | Out-Null
if (Test-Path $pacote) { Remove-Item $pacote }

# Entradas criadas uma a uma para garantir o separador "/", exigido por LMS em Linux.
$zip = [System.IO.Compression.ZipFile]::Open($pacote, 'Create')
try {
  Get-ChildItem -Path $origem -Recurse -File | ForEach-Object {
    $entrada = $_.FullName.Substring($origem.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entrada) | Out-Null
  }
}
finally {
  $zip.Dispose()
}

Write-Host "Pacote gerado em $pacote"
