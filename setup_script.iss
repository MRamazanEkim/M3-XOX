[Setup]
AppName=M3 XOX
AppVersion=1.1
DefaultDirName={pf}\M3 XOX
ArchitecturesInstallIn64BitMode=x64
DefaultGroupName=M3 XOX
UninstallDisplayIcon={app}\M3 XOX.exe
OutputDir=output
OutputBaseFilename=M3_XOX_Setup_V1.1
SetupIconFile=app_icon.ico
Compression=lzma
SolidCompression=yes

[Files]
Source: "build\M3 XOX-win32-x64\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\M3 XOX"; Filename: "{app}\M3 XOX.exe"
Name: "{group}\Uninstall M3 XOX"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\M3 XOX.exe"; Description: "Launch M3 XOX"; Flags: nowait postinstall skipifsilent
