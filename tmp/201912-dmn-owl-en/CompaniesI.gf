incomplete concrete CompaniesI of Companies = {
  lincat
    Statement = Text;
    Subject = NP;
    Verb = V2;
    Object = NP;
  lin
    mkStatement s v o =
      mkText (mkS (mkCl s (mkVP v o)));
}
      
