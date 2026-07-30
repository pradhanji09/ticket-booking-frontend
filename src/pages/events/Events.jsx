import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getEvents } from "./eventsService";
import {
  PageContainer,
  Card,
  Button,
  SecondaryButton,
  PaginationContainer,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventDetail = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchEvents = async (p) => {
    try {
      const res = await getEvents(p, 10);
      if (res?.success) {
        setEvents(res.events || []);
        if (res.pagination) {
          setPagination({
            page: Number(res.pagination.page),
            limit: Number(res.pagination.limit),
            total: Number(res.pagination.total),
            totalPages: Number(res.pagination.totalPages),
          });
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return (
    <PageContainer>
      <PageTitle>Events</PageTitle>
      {events.length === 0 ? (
        <Card>
          <EventDetail>No events available</EventDetail>
        </Card>
      ) : (
        <div>
          {events.map((event) => (
            <Card key={event._id || event.id}>
              <EventTitle>{event.name}</EventTitle>
              {event.description && (
                <EventDetail>{event.description}</EventDetail>
              )}
              <EventDetail>
                Date: {new Date(event.eventDate).toLocaleString()}
              </EventDetail>
              <EventDetail>Price: ₹{event.pricePerSeat}</EventDetail>
              <EventDetail>
                Total Seats: {event.totalSeats} | Status: {event.status}
              </EventDetail>
              <Button
                style={{ marginTop: "8px" }}
                onClick={() => navigate(`/events/${event._id || event.id}`)}
              >
                View Seats
              </Button>
            </Card>
          ))}
        </div>
      )}

      <PaginationContainer>
        <SecondaryButton
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </SecondaryButton>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <SecondaryButton
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </SecondaryButton>
      </PaginationContainer>
    </PageContainer>
  );
}
