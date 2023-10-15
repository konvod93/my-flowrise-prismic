import { Content, isFilled } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

import { createClient } from "@/prismicio";
import { PrismicNextImage } from "@prismicio/next";

const components: JSXMapSerializer = {
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className="text-center mb-9 font-semi">
      {children}
    </Heading>
  ),
  paragraph: ({ children }) => (
    <p className="text-xl md:text-2xl font-normal font-body text-slate-600 mb-8">
      {children}
    </p>
  ),

}

/**
 * Props for `Testinomials`.
 */
export type TestinomialsProps = SliceComponentProps<Content.TestinomialsSlice>;

/**
 * Component for "Testinomials" Slices.
 */
const Testinomials = async ({ slice }: TestinomialsProps): Promise<JSX.Element> => {
  
  const client = createClient();

  const testinomials = await Promise.all(
    slice.items.map((item) => {
      if (
        isFilled.contentRelationship(item.testinomial) && item.testinomial.uid
      ) {
        return client.getByUID("testinomial", item.testinomial.uid)
      }
    })
  )

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText components={components} field={slice.primary.heading} />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
        {testinomials.map((item, index) => item && (
          <div key={index} className="border bg-white shadow-lg rounded-lg px-8 md:px-14 py-10 md:py-16 grid content-between">
            <PrismicRichText field={item.data.quote} components={components} />
            <div className="flex items-center">
              <PrismicNextImage width={56} height={56} field={item.data.avatar}  className="rounded-full mr-4"  imgixParams={{ar: "1:1", fit: "crop"}}/>
            </div>
            <div>
              <p className="text-base font-medium text-slate-700">{item.data.name}</p>
              <p className="text-base text-slate-600">{item.data.job_title}</p>
            </div>
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Testinomials;
