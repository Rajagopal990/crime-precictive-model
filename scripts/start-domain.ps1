param()

$env:HOST = '0.0.0.0'
$env:PORT = '3000'
$env:BROWSER = 'none'
$env:DANGEROUSLY_DISABLE_HOST_CHECK = 'true'

& "$PSScriptRoot\..\node_modules\.bin\react-scripts.cmd" start
