interface LexDeontic = open Syntax in {
  param
    DOp = Oblig | Forb | Perm ;

  oper
    Deon : Type = { d   : DOp
                  ; pol : Pol
                  ; vv  : VV };
    
    D_Must  : Deon = { d = Oblig; pol = positivePol; vv = Deontic_must_VV };
    D_May   : Deon = { d = Perm;  pol = positivePol; vv = Deontic_may_VV };
    D_Shant : Deon = { d = Forb;  pol = negativePol; vv = Deontic_shant_VV };

}
