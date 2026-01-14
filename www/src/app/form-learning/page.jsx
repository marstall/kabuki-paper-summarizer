import { updateCart } from './lib.js';

export default function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    console.log({formData})
    const productId = formData.get('productId')
    await updateCart(productId)
    //console.log("AddToCart")
  }
  return (
    <section className="section">
    <form action={addToCart}>
      <div className="field">
        <label className="label">URL</label>
        <div className="control">
          <input className="input" type="text" name="url" placeholder="Text input"/>
        </div>
      </div>
      <button className="button is-primary">Submit</button>
    </form>
    </section>
  );
}
