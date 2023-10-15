import { Content, isFilled } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

import { createClient } from "@/prismicio";
import { PrismicNextImage } from "@prismicio/next";

const components: JSXMapSerializer = {
  heading2: ({ children }) => (
    <Heading as="h2" size="xl" className="md:mb-8 mb-4 mt-12 first:mt-0 last:mb-0">
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
      <div>
        {testinomials.map((item, index) => item && (
          <div key="index">
            <PrismicRichText field={item.data.quote} components={components} />
            <div>
              <PrismicNextImage width={56} height={56} field={item.data.avatar}  className="rounded-full mr-4"  imgixParams={{ar: "1:1", fit: "crop"}}/>
            </div>
            <div>
              <p>{item.data.name}</p>
              <p>{item.data.job_title}</p>
            </div>
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Testinomials;
