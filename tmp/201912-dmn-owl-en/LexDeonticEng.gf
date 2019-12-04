instance LexDeonticEng of LexDeontic =
  open SyntaxEng, ExtraEng
  in {
  oper
    Deontic_must_VV  = must_VV;
    Deontic_may_VV   = may_VV;

    Deontic_shant_VV = shall_VV;
    {- shall not = forbidden;
       we use shan't as a single token to represent prohibition
       because parsing of                    A must B
       gets confused when B matches "not C": A must   not  C
       does that mean                        A must  (not  C)
       or does it mean                       A (must  not) C
       ?
       this may seem laughable to you;
       if we decide to relax this restriction we can just
       set a higher parsing precedence on the (must not) binding.
       But I believe this is a real issue in deontic logic.
    -}
}
