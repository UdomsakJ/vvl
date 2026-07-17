# CLAUDE.md

คำแนะนำสำหรับ Claude Code เมื่อทำงานกับโปรเจกต์นี้

## ภาพรวม

เว็บไซต์ VetVitallist (VVL) — บริษัทเวชภัณฑ์สัตว์เลี้ยง สร้างด้วย **Astro** (static site)
ทำขึ้นใหม่แทนเว็บเดิมที่เป็น WordPress + Elementor โดยเป้าหมายหลักคือ **แก้ไขเนื้อหาง่าย** และ **โหลดเร็ว**

- เว็บเดิม (อ้างอิง): https://www.vetvitallist.co.th
- เนื้อหาเว็บ **ภาษาไทยเป็นหลัก** — ข้อความ UI, เนื้อหา, และ commit message ควรใช้ภาษาไทยได้
- เป็น static site ล้วน ไม่มี backend/ฐานข้อมูล

## คำสั่งที่ใช้บ่อย

```bash
npm install      # ติดตั้ง dependency (ครั้งแรก)
npm run dev      # dev server ที่ http://localhost:4321
npm run build    # build ไป dist/
npm run preview  # ดูตัวอย่างผล build
```

ไม่มี test runner, linter หรือ formatter ตั้งค่าไว้ — ตรวจงานด้วย `npm run build` ว่าผ่าน

## สถาปัตยกรรม

- **Astro 5** + content collections (ไม่มี framework UI อื่น เช่น React/Vue — ใช้ `.astro` ล้วน)
- output เป็น `static` (ดู `astro.config.mjs`)
- หน้าเว็บหลักคือ single-page เลื่อนยาว ประกอบจาก component ใน `src/components/`
  แล้วนำมาต่อกันใน `src/pages/index.astro`
- หน้าบทความข่าวสร้างแบบ dynamic จาก collection ผ่าน `src/pages/news/[slug].astro`

### โครงสร้างเนื้อหา (แก้ที่นี่เมื่อจะเปลี่ยนข้อความ/ข้อมูล)

| เนื้อหา | ตำแหน่ง | schema |
|---|---|---|
| ข้อมูลบริษัท/ติดต่อ/โซเชียล/จุดเด่น | `src/data/site.json` | ใช้ตรง ๆ ใน component |
| ผลิตภัณฑ์ (3 กลุ่ม) | `src/content/products/*.md` | `content.config.ts` → `products` |
| ข่าวสาร/บทความ | `src/content/posts/*.md` | `content.config.ts` → `posts` |
| คำถามที่พบบ่อย | `src/content/faq/*.md` | `content.config.ts` → `faq` |

- schema ของทุก collection อยู่ที่ `src/content.config.ts` — **แก้ schema ต้องแก้ทั้ง config.ts และ `public/admin/config.yml` ให้ตรงกัน**
- product ใช้ฟิลด์ `theme` (`blue`/`pink`/`yellow`) กำหนดโทนสีของการ์ด และ `order` กำหนดลำดับ
- product เก็บข้อมูลใน frontmatter ทั้งหมด (รวมรายการสินค้าย่อยใน `items[]`) ไม่มี body
- posts และ faq เก็บเนื้อหาใน body (Markdown)

### รูปภาพและฟอนต์

- รูปทั้งหมดอยู่ใน `public/images/` อ้างด้วย path แบบ absolute เช่น `/images/ชื่อไฟล์.png`
- ชื่อไฟล์รูปเป็น **ตัวพิมพ์เล็กทั้งหมด** (ดึงมาจากเว็บเดิมแล้ว lowercase) — ระวังตอนอ้างอิง
- ฟอนต์ SukhumvitSet อยู่ใน `public/fonts/` ประกาศ `@font-face` ใน `src/styles/global.css`

### สไตล์

- โทเคนสี/ฟอนต์กลางอยู่ใน `src/styles/global.css` เป็น CSS custom properties (`--c-primary` ฯลฯ)
- สีแบรนด์: primary `#004371`, secondary `#005480`, navy `#082b49`, teal `#1CB4AA`,
  pink `#EE94A0`, yellow/gold `#EEB818`, accent `#F26C6B`
- แต่ละ component มี `<style>` scoped ของตัวเอง — สไตล์เฉพาะส่วนให้อยู่ในไฟล์ component นั้น
- มี utility class กลาง: `.container`, `.section`, `.section--tint`, `.btn`, `.eyebrow`, `.reveal` (scroll animation)

## ระบบจัดการเนื้อหา (CMS)

- `public/admin/` = Sveltia CMS (Decap-compatible) ให้ทีมงานที่ไม่ใช่ dev แก้ผ่านเบราว์เซอร์
- `public/admin/config.yml` map ฟิลด์เข้ากับ collection — **ต้อง sync กับ `src/content.config.ts`**
- ยังต้องตั้งค่า `repo:` และ GitHub OAuth ก่อนใช้งานจริง (ดู README.md ข้อ 6)

## Deploy

- ปลายทาง: **Cloudflare Pages** (build: `npm run build`, output: `dist`)
- deploy อัตโนมัติเมื่อ push ขึ้น GitHub
- รายละเอียดการตั้งค่าและการชี้โดเมนอยู่ใน `README.md`

## ข้อควรระวัง

- อย่าใส่ path รูปที่ผิด case — ตรวจว่าไฟล์มีจริงใน `public/images/` ก่อนอ้างอิง
- เมื่อเพิ่มฟิลด์ใน content: อัปเดต **ทั้ง** `src/content.config.ts` และ `public/admin/config.yml`
- วันที่ในหน้าเว็บแสดงเป็นปี พ.ศ. (ใช้ `Intl.DateTimeFormat('th-TH', ...)`) — เป็นพฤติกรรมที่ตั้งใจไว้
- เนื้อหาผลิตภัณฑ์/การแพทย์ยึดตามเว็บเดิม อย่าแต่งสรรพคุณเพิ่มเอง
