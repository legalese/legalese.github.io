incomplete concrete CompaniesI of Companies = DeonticI ** {
  lincat
    Statement = Text;
    Subject = NP;
    Verb = V2;
    Object = NP;

    Deontic = Deon;
  lin
    mkStatement s d v o =
      mkText (mkS (mkTemp presentTense simultaneousAnt)
                d.pol
                (mkCl s d.vv (mkVP v o)));
    Alice          = mkParty "Alice";
    Bob            = mkParty "Bob";
    Eat            = V_eat;
    Ribeye         = N_ribeye;
    MashedPotatoes = N_mashed;
}
      
