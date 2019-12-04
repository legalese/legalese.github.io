abstract Companies = {
  flags startcat = Statement;
  cat
    Statement;
    Subject;
    Verb;
    Object;
  fun
    mkStatement :
         Subject
      -> Verb
      -> Object
      -> Statement;
}
