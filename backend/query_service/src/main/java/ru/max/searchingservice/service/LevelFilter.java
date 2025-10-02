package ru.max.searchingservice.service;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import ru.max.searchingservice.entity.Log;
import ru.max.searchingservice.entity.dto.LogFilter;
import ru.max.searchingservice.filter.LogSpecification;

public class LevelFilter implements LogSpecification {

    @Override
    public Query toQuery(LogFilter filter) {
        if (filter.getLevel() != null) {
            return Query.of(q -> q
                    .term(t -> t
                            .field("level")
                            .value(filter.getLevel())
                    )
            );
        }
        return null;
    }
}
