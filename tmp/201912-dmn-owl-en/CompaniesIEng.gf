--# -path=.:present

concrete CompaniesIEng of Companies = DeonticI ** CompaniesI with
  (Syntax = SyntaxEng)
  , (LexCompanies = LexCompaniesEng)
  , (LexDeontic = LexDeonticEng)
  , (Sentence = SentenceEng)
  ;
