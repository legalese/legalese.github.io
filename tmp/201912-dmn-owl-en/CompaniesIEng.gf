--# -path=.:present

concrete CompaniesIEng of Companies = CompaniesI with
  (Syntax = SyntaxEng)
  , (LexCompanies = LexCompaniesEng)
  , (Sentence = SentenceEng)
  ;
