@echo off
echo Checking common Android SDK locations...

set "POSSIBLE_PATHS=C:\Program Files\Android\android-sdk;%LOCALAPPDATA%\Android\Sdk;%APPDATA%\Local\Android\Sdk;%PROGRAMFILES(X86)%\Android\android-sdk;%PROGRAMFILES%\Android\android-sdk"

for %%p in (%POSSIBLE_PATHS%) do (
    if exist "%%p\platform-tools\adb.exe" (
        echo Found Android SDK at: %%p
        setx ANDROID_HOME "%%p"
        setx PATH "%PATH%;%%p\platform-tools"
        echo Environment variables have been set:
        echo ANDROID_HOME = %%p
        echo Added platform-tools to PATH
        echo.
        echo Please restart your terminal for changes to take effect.
        goto :found
    )
)

echo Android SDK not found in common locations.
echo Please make sure Android Studio is installed with SDK tools.
echo Current searched locations:
for %%p in (%POSSIBLE_PATHS%) do echo %%p

:found
pause
