package ru.max.searchingservice.service;

import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.springframework.stereotype.Service;
import ru.max.searchingservice.entity.Log;
import ru.max.searchingservice.entity.dto.LogFilter;
import ru.max.searchingservice.filter.LogSpecification;

@Service
public class SearchFilter implements LogSpecification {

    @Override
    public Query toQuery(LogFilter log) {
        if (log.getSearch() != null && !log.getSearch().isBlank()) {
            return Query.of(q -> q.multiMatch(
                    MultiMatchQuery.of(m -> m
                            .query(log.getSearch())
                            .fields("message^3")
                            .fields("level")
                            .fields("workspace")
                            .fields("component")
                            .fields("resourceType")
                    )
            ));
        }
        return null;
    }
}
