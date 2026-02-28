Set fso = CreateObject("Scripting.FileSystemObject")
Set WshShell = CreateObject("WScript.Shell")

' Locate project root (parent of electron/)
strScriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
strRoot = fso.GetParentFolderName(strScriptDir)
WshShell.CurrentDirectory = strRoot

' Launch bundled Electron directly (no node.exe intermediate = no console flash)
strElectron = strRoot & "\electron-dist\electron.exe"
strApp = strRoot & "\electron"

If fso.FileExists(strElectron) Then
  WshShell.Run """" & strElectron & """ """ & strApp & """", 0, False
Else
  ' Fallback: node + launch.cjs (dev mode)
  strBundledNode = strRoot & "\node\node.exe"
  If fso.FileExists(strBundledNode) Then
    WshShell.Run """" & strBundledNode & """ electron\launch.cjs", 0, False
  Else
    WshShell.Run "node electron\launch.cjs", 0, False
  End If
End If
