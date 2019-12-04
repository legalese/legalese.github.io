abstract Companies = Deontic ** {
  flags startcat = Statement;
  cat
    Statement;
    Subject;
    Verb;
    Object;
  fun
    mkStatement :
         Subject
      -> Deontic
      -> Verb
      -> Object
      -> Statement;
    Alice, Bob : Subject;
    Eat : Verb;
    Ribeye, MashedPotatoes : Object;
}
