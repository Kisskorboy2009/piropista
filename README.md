# PiroPista – piropista.hu

Szabó István Attila (PiroPista) bemutatkozó oldala: pirográfia, cérnaképek, táblák, egyedi ajándékok.

Sima statikus oldal (HTML + CSS + egy kis JavaScript), nincs szükség semmilyen telepítésre vagy build-lépésre.

## Szerkezet

```
index.html          a teljes oldal
404.html            „nincs ilyen oldal” lap
css/style.css       minden stílus (a betűtípusok is innen töltődnek)
js/main.js          menü, galériaszűrő, képnagyító, Messenger-üzenet
fonts/              Fraunces és Karla betűk helyben (nem a Google-tól töltődnek)
img/munkak/         a galéria képei nagyban
img/munkak/kicsi/   ugyanezek kisebb méretben (ezek látszanak a rácsban)
img/muhely/         műhelyképek, logó
img/og.jpg          ez a kép jelenik meg, ha valaki megosztja a linket Facebookon
CNAME               a piropista.hu domain a GitHub Pages-hez
```

## Feltöltés GitHub Pages-re

1. Töltsd fel a mappa teljes tartalmát a `piropista` repó gyökerébe (a `main` ágra).
2. A repóban: **Settings → Pages → Build and deployment**
   - Source: *Deploy from a branch*
   - Branch: `main`, mappa: `/ (root)` → Save
3. Ugyanitt a **Custom domain** mezőbe: `piropista.hu` (a `CNAME` fájl miatt ez magától is kitöltődhet).
4. A domainszolgáltatónál (DNS-beállítások) vedd fel ezeket:
   - `A` rekord, név: `@` → `185.199.108.153`
   - `A` rekord, név: `@` → `185.199.109.153`
   - `A` rekord, név: `@` → `185.199.110.153`
   - `A` rekord, név: `@` → `185.199.111.153`
   - `CNAME` rekord, név: `www` → `<github-felhasználóneved>.github.io`
5. Ha a DNS beállt (pár perc, néha pár óra), a Pages oldalon pipáld be: **Enforce HTTPS**.

## Új munka hozzáadása a galériához

1. A képet tedd be kétszer: nagyban (kb. 1600 px) az `img/munkak/` mappába, kicsiben (kb. 720 px) az `img/munkak/kicsi/` mappába, ugyanazzal a névvel.
2. Az `index.html`-ben másolj le egy meglévő `<figure class="item" ...>` blokkot a galériában, és írd át:
   - `data-cat`: `egetett`, `cerna`, `tabla` vagy `ajandek` (ettől függ, melyik szűrőnél jelenik meg)
   - a két képútvonalat, a `data-w` / `data-h` (nagy kép mérete) és a `width` / `height` (kis kép mérete) értékeket
   - az `alt` szöveget (mit ábrázol a kép, ez a keresőknek és a gyengénlátóknak kell)
   - a címet (`<strong>`) és a rövid leírást (`<span>`)

## Kapcsolat

A „Rendelnél valamit?” űrlap nem küld semmit szerverre: összerakja az üzenetet, kimásolja a vágólapra, és megnyitja a Messengert (`https://m.me/ecko6`). Ha később lesz e-mail-cím vagy telefonszám, az `index.html` „Kapcsolat” részében a `channels` listába lehet új sort tenni.
