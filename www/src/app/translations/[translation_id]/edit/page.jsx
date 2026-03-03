import TranslationNew from "../../new/translation-new.tsx";

export default async function Page({params}) {
  return (
    <TranslationNew {...await params}/>
  );
}
