# That Simple Model
[![CircleCI](https://circleci.com/gh/ThatDevCompany/that-simple-model.svg?style=svg)](https://circleci.com/gh/ThatDevCompany/that-simple-model)

##  Overview
A simple set of Model definition Decorators

### Example Model
The following example describes a very simple Model with both a
Primary and a Secondary key

In this instance, the primary key (also known as the Partition key)
can be used for partitioning the database during persistence

```
@Model()
class Book {
    static meta: IMetaModel
    meta: IMetaModel

    @PrimaryKey
    clientId: string

    @SecondaryKey
    bookId: string

    title: string
}
```

The following shows a more traditional model with just a primary key
```
@Model()
class Book implements IModel {
    static meta: IMetaModel
    meta: IMetaModel

    @PrimaryKey
    bookId: string = uuid.v4()

    title: string
}
```

### Model decorator
The model decorator adds a IMetaModel object to the prototype of the class. This provides access to "introspect"
the meta data for the model.

The title, description and kind can all be set/overriden as part of the Model decorator

```
@Model({
    title: 'A Book',
    description: 'A collection of pages with words on',
    kind: 'tblBook'
})
class Book {
    static meta: IMetaModel
    meta: IMetaModel

    @PrimaryKey
    clientId: string

    @SecondaryKey
    bookId: string

    title: string
}
```