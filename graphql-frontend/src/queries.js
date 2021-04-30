import { gql  } from '@apollo/client'

//////   FRAGMENTS   //////

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author {
        name
        born
        bookCount
        id
    }
`

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        author { name }
        published
        genres
        id
    }
`
//////   SUBSCRIPTIONS   //////

export const BOOK_ADDED = gql`  
    subscription {
        bookAdded {
            ...BookDetails
        }
    }  
    ${BOOK_DETAILS}
`

export const AUTHOR_EDITED = gql`  
    subscription {
        authorEdited {
            ...AuthorDetails
        }
    }  
    ${AUTHOR_DETAILS}
`

//////   QUERIES   //////

export const ALL_AUTHORS = gql`
    query allAuthors {
        allAuthors {
            ...AuthorDetails
        }
    }
    ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
    query allBooks($author: String, $genre: String) {
        allBooks (
            author: $author,
            genre: $genre
        ) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const ME = gql`
    query me {
        me {
            username
            favoriteGenre
        }
    }
`

//////   MUTATIONS   //////

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor( 
            name: $name,
            setBornTo: $setBornTo
        ) {
            ...AuthorDetails
        }
    }
    ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`