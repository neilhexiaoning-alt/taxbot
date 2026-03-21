!macro customInstall
  ; Add Windows Firewall rule (prevents firewall popup on first launch)
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="慧助理" dir=in action=allow program="$INSTDIR\慧助理.exe" enable=yes profile=private,public'
!macroend

!macro customUnInstall
  ; Remove Windows Firewall rule on uninstall
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="慧助理"'
!macroend
