instance LexCompaniesEng of LexCompanies =
  open SyntaxEng, ParadigmsEng, IrregEng, ExtraEng in
  {
  oper
    P_bob = mkNP (mkPN "Bob");
    P_alice = mkNP (mkPN "Alice");
    V_eat = mkV2 "eat";
    N_ribeye = mkNP (mkN "ribeye");
    N_mashed = mkNP (mkCN (mkA "mashed") (mkN "potatoes"));
}
      
