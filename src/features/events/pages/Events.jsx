import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getEvents } from "../api/eventsService";
import {
  PageContainer,
  Card,
  Button,
  SecondaryButton,
  GridContainer,
  Badge,
  PaginationContainer,
} from "../../../components/ui";

const HeaderSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EventCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const EventDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 14px;
  line-height: 1.4;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 14px;
  font-size: 13px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textMuted};

  span:last-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const PriceTag = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
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
      <HeaderSection>
        <Badge status="ACTIVE">{pagination.total || events.length} Events Available</Badge>
      </HeaderSection>

      {events.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#71717a" }}>No events available right now.</p>
        </Card>
      ) : (
        <GridContainer>
          {events.map((event) => (
            <EventCard key={event._id || event.id}>
              <div>
                <EventHeader>
                  <EventTitle>{event.name}</EventTitle>
                  <Badge status={event.status}>{event.status}</Badge>
                </EventHeader>

                {event.description && (
                  <EventDescription>{event.description}</EventDescription>
                )}

                <EventMeta>
                  <MetaRow>
                    <span>Date</span>
                    <span>{new Date(event.eventDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                  </MetaRow>
                  <MetaRow>
                    <span>Seats</span>
                    <span>{event.totalSeats} Total</span>
                  </MetaRow>
                </EventMeta>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", color: "#71717a" }}>Price per seat</span>
                  <PriceTag>₹{event.pricePerSeat}</PriceTag>
                </div>

                <Button
                  style={{ width: "100%" }}
                  disabled={event.status === "CANCELLED"}
                  onClick={() => navigate(`/events/${event._id || event.id}`)}
                >
                  Book Seats
                </Button>
              </div>
            </EventCard>
          ))}
        </GridContainer>
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
