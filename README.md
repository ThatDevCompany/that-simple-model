# That Simple Model

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
