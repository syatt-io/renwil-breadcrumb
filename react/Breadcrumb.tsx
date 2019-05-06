import React, { Fragment, useMemo } from 'react'
import unorm from 'unorm'
import { Link } from 'vtex.render-runtime'
import { IconCaret, IconHome } from 'vtex.store-icons'

import styles from './breadcrumb.css'

const LINK_CLASS_NAME = `${styles.link} dib pv1 link ph2 c-muted-2 hover-c-link`

interface Category {
  name: string
  href: string
}

interface Props {
  term?: string
  /** Shape [ '/Department' ,'/Department/Category'] */
  categories: string[]
  categoryTree: Category[]
}

const makeLink = (str: string) =>
  unorm
    .nfd(str)
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-')

const getCategoriesList = (categories: string[]) : Category[] => {
  const categoriesSorted = categories
    .slice()
    .sort((a, b) => a.length - b.length)
  return categoriesSorted.map(category => {
    const categoryStripped = category
      .replace(/^\//, '')
      .replace(/\/$/, '')
    const currentCategories = categoryStripped.split('/')
    const [categoryKey] = currentCategories.reverse()
    const linkCompletion = currentCategories.length === 1 ? '/d' : ''
    const href = `/${makeLink(categoryStripped)}${linkCompletion}`
    return {
      href,
      name: categoryKey,
    }
  })
}

/**
 * Breadcrumb Component.
 */
const Breadcrumb = ({ term, categories, categoryTree }: Props) => {
  const categoriesList = categoryTree 
    ? categoryTree
    : useMemo(() => getCategoriesList(categories), [categories])

  return !categoriesList.length
    ? null 
    : (
      <div className={`${styles.container} dn db-ns pv3`}>
        <Link className={`${LINK_CLASS_NAME} v-mid`} page="store.home">
          <IconHome size={26} />
        </Link>
        {categoriesList.map(({ name, href }, i) => (
          <span key={`category-${i}`} className={`${styles.arrow} ph2 c-muted-2`}>
            <IconCaret orientation="right" size={8} />
            <Link className={LINK_CLASS_NAME} to={href}>
              {name}
            </Link>
          </span>
        ))}

        {term && (
          <Fragment>
            <span className={`${styles.arrow} ph2 c-muted-2`}>
              <IconCaret orientation="right" size={8} />
            </span>
            <span className={`${styles.term} ph2 c-on-base`}>{term}</span>
          </Fragment>
        )}
      </div>
    )
}

Breadcrumb.defaultProps = {
  categories: [],
}

export default Breadcrumb
