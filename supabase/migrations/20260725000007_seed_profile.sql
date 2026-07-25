-- Initial profile seed data
insert into profiles (
  full_name,
  professional_title,
  bio,
  email,
  phone,
  github_url,
  institution,
  study_program,
  graduation_year
) values (
  'Rizka Aulia',
  'Full-Stack Developer',
  'Passionate about building web products from interface through data and backend logic.',
  'rizkaauliaa198@gmail.com',
  '+62 813-7061-7604',
  'https://github.com/rizkaauliaa',
  'Politeknik Negeri Lhokseumawe',
  'Information Technology and Computer',
  2025
)
on conflict do nothing;
