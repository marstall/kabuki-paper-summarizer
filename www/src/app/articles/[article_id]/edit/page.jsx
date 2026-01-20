import ArticleNew from "../../new/article-new.jsx";

export default async function Page({params}) {
  return (
    <ArticleNew {...await params}/>
  );
}
