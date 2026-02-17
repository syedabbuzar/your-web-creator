

## Plan: Exam Result PDF Attachments + Multiple Image Upload

### Part 1: Exam Result mein PDF Attachment Feature

**Kya hoga:**
- Jab admin result add/edit kare, toh waha PDF files upload kar sake
- Ek result ke saath multiple PDFs attach ho sakein
- Published results ke neeche PDF list show hogi with download button
- Storage bucket `exam-resources` (already exists) use hoga

**Database Changes:**
- Naya table `exam_result_attachments` banegi:
  - `id` (uuid, primary key)
  - `result_id` (uuid, foreign key to exam_results)
  - `file_name` (text)
  - `file_url` (text)
  - `file_size` (text)
  - `created_at` (timestamp)
- Public RLS policies (existing pattern follow karenge)

**UI Changes (Exam.tsx):**
- Result dialog mein PDF upload section add hoga (multiple files)
- Result card ke neeche attached PDFs ki list show hogi with download icons
- Admin delete kar sake individual attachments

---

### Part 2: Multiple Image Upload (Device se Upload)

**Kya hoga:**
- Jaha bhi admin images add karta hai (Leaders, Gallery, Events), waha device se file upload ka option milega (URL ke saath)
- Images storage bucket mein upload hongi
- Multiple images ek saath select kar sake

**Database/Storage Changes:**
- Naya storage bucket `site-images` banegi for general image uploads
- Public bucket hogi taaki images website pe show ho sakein

**UI Changes:**
- **About.tsx (Leaders)**: Image URL field ke saath ek "Upload Image" button bhi hoga
- **Campus.tsx (Gallery)**: Image URL field ke saath "Upload Image" button + multiple images ek saath upload kar sake
- **Events page**: Event form mein bhi image upload option

---

### Technical Details

**New Database Table:**
```sql
CREATE TABLE exam_result_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id UUID REFERENCES exam_results(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS policies (public read/insert/update/delete)
-- Storage bucket for site images
```

**Files Modified:**
1. `src/pages/Exam.tsx` - Result dialog mein PDF upload + result card pe PDF list
2. `src/pages/About.tsx` - Leader form mein image upload button
3. `src/pages/Campus.tsx` - Gallery form mein image upload button + multi-select
4. Common upload helper reuse karenge (already exists in Exam.tsx)

**Upload Flow:**
1. Admin file select kare (device se)
2. File storage bucket mein upload ho
3. Public URL milegi
4. URL database mein save hogi

