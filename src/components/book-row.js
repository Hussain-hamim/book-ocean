/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from 'react-router-dom'
import {useListItem} from 'utils/list-items'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {StatusButtons} from './status-buttons'
import {Rating} from './rating'
// import {DarkModeContext} from 'app.exercise'
import {DarkModeContext} from 'index.exercise'

import React from 'react'

function BookRow({book}) {
  const {title, author, coverImageUrl} = book
  const listItem = useListItem(book.id)
  const [darkMode] = React.useContext(DarkModeContext)

  // console.log(listItem)

  const id = `book-row-book-${book.id}`

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        // width: '100%',
        right: '20px',
        // paddingRight: '20px',
      }}
    >
      <Link
        aria-labelledby={id}
        to={`/book/${book.id}`}
        css={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          flexGrow: 2,
          gridGap: 20,

          padding: '1.25em',

          minHeight: 270,
          border: `1px solid ${colors.gray20}`,
          // color: colors.text,
          borderRadius: '3px',
          backgroundColor: darkMode.darkMode ? '#212529' : 'white',
          color: darkMode.darkMode ? 'white' : colors.text,

          ':hover,:focus': {
            textDecoration: 'none',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.08)',
            // color: 'inherit',
            color: darkMode.darkMode ? 'white' : 'black',
          },
        }}
      >
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 120,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{maxHeight: '100%', width: '100%', borderRadius: '4px'}}
          />

          <div
            css={{
              marginTop: 10,
              [mq.small]: {
                marginTop: '30px',
              },
            }}
          >
            <div
              css={{
                // marginTop: '0.4em',
                fontStyle: 'italic',
                fontSize: '0.85em',
              }}
            >
              {author}
            </div>
            <small>{book.publisher}</small>
          </div>
        </div>

        <div css={{flex: 1}}>
          <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  margin: '0',
                  color: darkMode.darkMode ? 'wheat' : colors.indigo,
                  ':hover,:focus': {
                    color: colors.indigo,
                  },
                }}
              >
                {title}
              </h2>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            </div>

            {/* <div css={{marginLeft: 10}}>
              <div
                css={{
                  marginTop: '0.4em',
                  fontStyle: 'italic',
                  fontSize: '0.85em',
                }}
              >
                {author}
              </div>
              <small>{book.publisher}</small>
            </div> */}
          </div>

          <small css={{whiteSpace: 'break-spaces', display: 'block'}}>
            {book.synopsis.substring(0, 500)}...
          </small>
        </div>
      </Link>

      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          right: -20,

          color: colors.gray80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <StatusButtons book={book} />
      </div>
    </div>
  )
}

export {BookRow}
