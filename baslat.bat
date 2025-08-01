@echo off
title Discord Çekiliş Botu
color 0a

echo.
echo ========================================
echo    Discord Çekiliş Botu Baslatiliyor...
echo    Versiyon: 1.0.0
echo ========================================
echo.

echo Node.js kontrol Ediliyor...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadi!
    echo Lütfen Node.js'i https://nodejs.org adresinden indirin ve kurun.
    pause
    exit /b 1
)

echo ✅ Node.js bulundu!

echo.
echo Bagimliliklar kontrol ediliyor...
if not exist "node_modules" (
    echo 📦 Bagimliliklar yükleniyor...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Bagimliliklar yüklenirken hata oluştu!
        pause
        exit /b 1
    )
    echo ✅ Bagimliliklar yüklendi!
) else (
    echo ✅ Bagimliliklar zaten yüklü!
)

echo.
echo Config dosyasi kontrol ediliyor...
if not exist "config.json" (
    echo ❌ config.json dosyasi bulunamadı!
    echo Lütfen config.json dosyasini oluşturun ve bot token'inizi ekleyin.
    pause
    exit /b 1
)

echo ✅ Config dosyasi bulundu!

echo.
echo 🚀 Bot Baslatiliyor...
echo.

npm start

echo.
echo Bot Kapatildi. Cikmak Icin herhangi bir tuşa basin...
pause >nul 