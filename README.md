# Discord Çekiliş Botu

Bu bot Discord sunucularında çekiliş yapmanızı sağlar. Kullanıcılar butona tıklayarak çekilişe katılabilir ve belirlenen süre sonunda kazananlar otomatik olarak seçilir.

## Özellikler

- 🎉 `/giveaway` komutu ile çekiliş başlatma
- ⏰ Belirlenen süre sonunda otomatik sonlandırma
- 🎭 Rol bazlı katılım kontrolü
- 🏆 Çoklu kazanan seçimi
- 📢 Kazananları etiketleme ve özel mesaj gönderme
- 💾 Çekiliş verilerini JSON dosyasında saklama


## NOT:
## 1:
- Lütfen `data/giveaways.json` kendiniz açmayın bot otomatik kendi oluşturuyor 

## Kurulum

### 1. Gereksinimler
- Node.js (v16 veya üzeri)
- Discord Bot Token

### 2. Bot Oluşturma
1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Bot sekmesine gidin ve "Add Bot" butonuna tıklayın
4. Bot token'ını kopyalayın
5. OAuth2 > URL Generator sekmesine gidin
6. Scopes: `bot` ve `applications.commands` seçin
7. Bot Permissions: `Send Messages`, `Use Slash Commands`, `Manage Messages` seçin
8. Oluşturulan URL'yi kullanarak botu sunucunuza ekleyin

### 3. Kurulum Adımları

1. Projeyi klonlayın veya indirin
2. Terminal'de proje klasörüne gidin
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. `config.json` dosyasını düzenleyin:
   ```json
   {
     "token": "your_bot_token_here",
     "clientId": "your_client_id_here"
   }
   ```
5. Botu çalıştırın:
   ```bash
   npm start
   ```

## Kullanım

### Çekiliş Başlatma
```
/giveaway ödül:Discord Nitro süre:1d kazanan_sayısı:1
```

### Parametreler
- **ödül**: Çekilişte verilecek ödül (zorunlu)
- **süre**: Çekiliş süresi (örn: 30s, 5m, 2h, 1d, 1w) (zorunlu)
- **kazanan_sayısı**: Kaç kişi kazanacak (zorunlu)
- **kanal**: Çekilişin yapılacağı kanal (opsiyonel)
- **image**: Çekilişin yapılacağı kanal (opsiyonel)
- **rol**: Çekilişe katılabilecek rol (opsiyonel)
- **açıklama**: Çekiliş açıklaması (opsiyonel)

### Örnekler

**Basit çekiliş:**
```
/giveaway ödül:Discord Nitro süre:1d kazanan_sayısı:1
```

**Rol gerektiren çekiliş:**
```
/giveaway ödül:Özel Rol süre:1w kazanan_sayısı:3 rol:@VIP açıklama:VIP üyeler için özel çekiliş!
```

**Belirli kanalda çekiliş:**
```
/giveaway ödül:Steam Oyunu süre:2h kazanan_sayısı:1 kanal:#çekilişler
```

## Özellikler Detayı

### 🎯 Çekiliş Sistemi
- Kullanıcılar butona tıklayarak çekilişe katılır
- Aynı kullanıcı birden fazla kez katılamaz
- Belirlenen süre sonunda otomatik olarak kazananlar seçilir
- Kazananlar etiketlenir ve özel mesaj alır

### 🎭 Rol Kontrolü
- Belirli bir role sahip kullanıcılar çekilişe katılabilir
- Rol kontrolü otomatik olarak yapılır

### 📊 Veri Saklama
- Çekiliş verileri `data/giveaways.json` dosyasında saklanır
- Bot yeniden başlatıldığında veriler korunur

### 🔔 Bildirimler
- Kazananlar özel mesaj alır
- Çekiliş sonuçları kanalda paylaşılır
- "Lütfen hediyinizi almayı unutmayın!" mesajı gönderilir

## Dosya Yapısı

```
discord-giveaway-bot/
├── commands/
│   └── giveaway.js          # Çekiliş komutu
├── events/
│   ├── ready.js             # Bot hazır event'i
│   └── interactionCreate.js # Etkileşim event'i
├── data/
│   └── giveaways.json       # Çekiliş verileri
├── config.json              # Bot konfigürasyonu
├── index.js                 # Ana bot dosyası
├── package.json             # Proje bağımlılıkları
└── README.md               # Bu dosya
```

## Gereksinimler

- Discord.js v14
- Node.js v16+
- Discord Bot Token
- Gerekli Discord izinleri

## Lisans

MIT License

## Destek

Herhangi bir sorun yaşarsanız, lütfen discord sunucumuzdan destek alın. 
# [Discord](https://discord.gg/9J8KB2brj6)