import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Create Powerful Lists',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Listed let's your brand's customers save things they love on your website and supports actions like
          share, quick reorder, email.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Listed handles plumbing so that you can focus on delivering user experience.
          If you want help understanding how to best use lists, we can help with that too.
      </>
    ),
  },
  {
    title: 'Built for Developers',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        We provide a modern JavaScript SDK, GraphQL and Rest apis.
          Create an account, import our SDK and go.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
