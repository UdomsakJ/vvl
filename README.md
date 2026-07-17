# VetVitallist – เว็บไซต์ใหม่ (Astro)

เว็บไซต์ใหม่ของ VetVitallist ที่สร้างด้วย [Astro](https://astro.build) แทน WordPress + Elementor
เป้าหมายคือ **แก้ไขเนื้อหาได้ง่าย** และ **โหลดเร็ว** โดยไม่ต้องพึ่ง WordPress

- เนื้อหาทั้งหมดเก็บเป็นไฟล์ Markdown / JSON — dev แก้ในโค้ดได้โดยตรง
- ทีมงานที่ไม่ใช่ dev แก้ผ่านหน้าเว็บได้ที่ `/admin/` (ระบบ CMS)
- เว็บ build ออกมาเป็นไฟล์ HTML/CSS/JS ธรรมดา (static) โฮสต์ฟรีบน Cloudflare Pages

---

## 1. โครงสร้างโปรเจกต์

```
E:\Work\VVL\WebSite
├─ public/
│  ├─ images/          รูปภาพและโลโก้ทั้งหมด
│  ├─ fonts/           ฟอนต์ SukhumvitSet
│  └─ admin/           หน้า CMS (index.html + config.yml)
├─ src/
│  ├─ content/
│  │  ├─ products/     ผลิตภัณฑ์ (Sensotop, Aller, VC.AllerCare)
│  │  ├─ posts/        ข่าวสาร/บทความ
│  │  └─ faq/          คำถามที่พบบ่อย
│  ├─ data/site.json   ข้อมูลบริษัท ที่อยู่ เบอร์โทร โซเชียล
│  ├─ components/       ส่วนต่าง ๆ ของหน้า (Header, Hero, Products, ...)
│  ├─ layouts/          โครง HTML หลัก
│  ├─ pages/            หน้าเว็บ (หน้าแรก + หน้าบทความ)
│  └─ styles/global.css สี ฟอนต์ และสไตล์กลาง
├─ astro.config.mjs
└─ package.json
```

## 2. รันบนเครื่องตัวเอง (สำหรับ dev)

ต้องมี [Node.js](https://nodejs.org) เวอร์ชัน 18 ขึ้นไป (แนะนำ 20+)

```bash
npm install      # ติดตั้งครั้งแรกครั้งเดียว
npm run dev      # เปิด http://localhost:4321 แก้ไฟล์แล้วเห็นผลทันที
npm run build    # สร้างไฟล์เว็บจริงลงโฟลเดอร์ dist/
npm run preview  # ดูตัวอย่างเว็บที่ build แล้ว
```

## 3. วิธีแก้ไขเนื้อหา

### แบบที่ 1 — แก้ไฟล์ตรง ๆ (dev)

| อยากแก้ | ไฟล์ |
|---|---|
| ข้อมูลบริษัท / ที่อยู่ / เบอร์โทร / โซเชียล | `src/data/site.json` |
| ผลิตภัณฑ์และสินค้าย่อย | `src/content/products/*.md` |
| ข่าวสาร / บทความ | `src/content/posts/*.md` |
| คำถามที่พบบ่อย | `src/content/faq/*.md` |
| รูปภาพ | ใส่ไฟล์ใน `public/images/` แล้วอ้างเป็น `/images/ชื่อไฟล์` |
| สี / ฟอนต์ | `src/styles/global.css` (ตัวแปร `--c-primary` ฯลฯ) |

แต่ละไฟล์ Markdown มีส่วนหัว (frontmatter) คั่นด้วย `---` กรอกค่าตามฟิลด์ที่มีอยู่ได้เลย

### แบบที่ 2 — แก้ผ่านหน้าเว็บ (ทีมงานทั่วไป)

เข้า `https://<โดเมน>/admin/` จะเจอหน้าจอ CMS ภาษาไทย
กดแก้ผลิตภัณฑ์ / ข่าวสาร / FAQ / ข้อมูลติดต่อ ได้เลย เมื่อกด **Publish**
ระบบจะ commit กลับเข้า Git และเว็บจะ deploy ใหม่อัตโนมัติ (ดูข้อ 5)

> ระบบ CMS ใช้ [Sveltia CMS](https://github.com/sveltia/sveltia-cms) ต้องตั้งค่า GitHub OAuth ก่อนใช้งานครั้งแรก — ดูข้อ 6

## 4. เตรียมขึ้น Git

โปรเจกต์นี้ยังไม่ได้เป็น git repo — เริ่มต้นด้วย:

```bash
cd E:\Work\VVL\WebSite
git init
git add .
git commit -m "Initial VetVitallist website (Astro)"
```

แล้วสร้าง repo บน GitHub และ push ขึ้นไป

## 5. Deploy ขึ้น Cloudflare Pages

1. เข้า [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. เลือก GitHub repo ที่ push ไว้
3. ตั้งค่า build:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. กด **Save and Deploy** — รอสักครู่จะได้ URL `https://<ชื่อ>.pages.dev`

ทุกครั้งที่ push ขึ้น GitHub (หรือทีมงานกด Publish ใน CMS) Cloudflare จะ build และ deploy ใหม่อัตโนมัติ

### ชี้โดเมน vetvitallist.co.th มาที่เว็บใหม่

ใน Cloudflare Pages → โปรเจกต์ → **Custom domains** → **Set up a custom domain**
กรอก `www.vetvitallist.co.th` และ `vetvitallist.co.th` แล้วทำตามที่ระบบบอก
(ปรับ DNS record ที่ผู้ให้บริการโดเมน — Cloudflare จะแสดงค่าที่ต้องใส่)

> แนะนำให้ทดสอบบน URL `.pages.dev` ให้เรียบร้อยก่อน แล้วค่อยสลับโดเมนจาก WordPress มาที่เว็บใหม่

## 6. การเปิดใช้งานระบบจัดการเนื้อหา (CMS)

หน้า `/admin/` ต้องเชื่อมกับ GitHub เพื่อบันทึกการแก้ไข ทำครั้งเดียว:

1. แก้ `public/admin/config.yml` บรรทัด `repo:` ให้เป็นชื่อ repo จริง เช่น `vetvitallist/website`
   และ `branch:` ให้ตรงกับ branch หลัก (`main` หรือ `master`)
2. สร้างตัวเชื่อม OAuth ให้ Cloudflare Pages — วิธีที่ง่ายที่สุดคือใช้
   [Sveltia CMS Auth worker](https://github.com/sveltia/sveltia-cms-auth)
   (deploy เป็น Cloudflare Worker ฟรี) แล้วสร้าง **GitHub OAuth App**:
   - ไปที่ GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - **Authorization callback URL** ใส่ URL ของ auth worker
   - นำ Client ID / Secret ไปใส่ใน worker ตามคู่มือ
3. เพิ่มบรรทัด `base_url:` ใน `config.yml` ให้ชี้ไปที่ auth worker (ดูคู่มือของ sveltia-cms-auth)

เมื่อเสร็จแล้ว ทีมงานเข้า `/admin/` แล้ว **Login with GitHub** เพื่อแก้เนื้อหาได้เลย

> ทางเลือก: ถ้าไม่อยากตั้งค่า OAuth สามารถให้ dev เป็นคนแก้ไฟล์แล้ว push แทนได้ (ข้อ 3 แบบที่ 1) — เว็บก็ยัง deploy อัตโนมัติเหมือนเดิม

---

## หมายเหตุ

- เว็บนี้เป็น **static site** ไม่มีฐานข้อมูล ปลอดภัยกว่า WordPress และไม่มีปลั๊กอินให้ต้องคอยอัปเดต
- ฟอนต์ SukhumvitSet และรูปทั้งหมดถูกดึงมาจากเว็บเดิมแล้ว เก็บไว้ใน `public/`
- โทนสีแบรนด์ (จาก Elementor kit เดิม): น้ำเงินหลัก `#004371`, teal `#1CB4AA`, ชมพู `#EE94A0`, เหลือง `#EEB818`
