-- Fix: Set portfolio-assets bucket to public
-- The bucket was created with public=false, but public URLs 
-- (/storage/v1/object/public/...) require the bucket to be public.
update storage.buckets
set public = true
where id = 'portfolio-assets';
