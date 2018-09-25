# That Simple ORM

##  Overview
A simple typescript ORM

### Example Model

```
@Model({
    description: 'A thing with words in it'
    table: 'tblBooks'
})
class Book implements IModel {
    static meta: MetaModel
    meta: MetaModel

    @PartitionKey
    clientId: string

    @SortingKey
    bookId: string

    title: string
}
```

