incomplete concrete CompaniesI of Companies = {
  lincat
    Statement = Text;
    Subject = NP;
    Verb = V2;
    Object = NP;
  lin
    mkStatement s v o =
      mkText (mkS (mkCl s (mkVP v o)));
    Alice          = mkParty "Alice";
    Bob            = mkParty "Bob";
    Eat            = V_eat;
    Ribeye         = N_ribeye;
    MashedPotatoes = N_mashed;
}
      
