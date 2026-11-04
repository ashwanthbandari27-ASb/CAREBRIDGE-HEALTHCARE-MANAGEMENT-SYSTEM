insert into public.pharmacy_products(name,category,description,price,in_stock,requires_prescription) values
('Paracetamol 650mg','Pain relief','General pain and fever relief information',32,120,false),
('Vitamin D3','Health supplements','Vitamin D3 dietary supplement',289,60,false),
('Cetirizine 10mg','Anti-allergy','Non-prescription allergy medication reference',48,85,false),
('ORS Sachets','Electrolytes','Oral rehydration salts',18,200,false)
on conflict do nothing;

-- Demo records are intentionally attached only when a matching authenticated patient exists.
insert into public.notifications(user_id,title,message,type,link)
select p.user_id,'Blood report ready','The laboratory report you requested is ready for review.','lab','/app/records'
from public.patients p where not exists (select 1 from public.notifications n where n.user_id=p.user_id and n.title='Blood report ready');
insert into public.notifications(user_id,title,message,type,link)
select p.user_id,'Follow-up due soon','Your care follow-up is due in 3 days.','appointment','/app/appointments'
from public.patients p where not exists (select 1 from public.notifications n where n.user_id=p.user_id and n.title='Follow-up due soon');
insert into public.care_gaps(patient_id,category,title,description,due_at,status)
select p.id,'lab','Blood test result pending','The workflow is awaiting the blood test result.',now()+interval '1 day','pending'
from public.patients p where not exists (select 1 from public.care_gaps g where g.patient_id=p.id and g.title='Blood test result pending');
