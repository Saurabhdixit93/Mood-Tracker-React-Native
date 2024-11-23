@echo off
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
echo Android environment variables have been set.
echo Please restart your terminal for the changes to take effect.
pause
