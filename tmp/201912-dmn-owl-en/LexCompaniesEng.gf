instance LexCompaniesEng of LexCompanies =
  open SyntaxEng, ParadigmsEng, IrregEng, ExtraEng in
  {
  oper
    mkParty str = mkNP (mkPN str);
    V_eat = mkV2 "eat";
    N_ribeye = mkNP (mkCN (mkN "ribeye"));
    N_mashed = mkNP (mkCN (mkA "mashed") (mkN "potatoes"));
}
      
