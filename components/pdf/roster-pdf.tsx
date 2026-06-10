import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

export type PDFGame = {
  id: string
  index: number
  date: string | null
  time: string | null
  homeTeam: string
  awayTeam: string
  field: string | null
  location: string | null
  players: { name: string; notes: string | null }[]
}

export type RosterPDFProps = {
  academyName: string
  logoUrl: string | null
  gameDayName: string
  groupName: string
  leadCoach: string | null
  games: PDFGame[]
}

const BRAND = '#1a472a'
const LIGHT = '#f4f6f4'
const BORDER = '#d0d7ce'
const TEXT = '#1a1a1a'
const MUTED = '#6b7280'
const WHITE = '#ffffff'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT,
    backgroundColor: WHITE,
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: 12,
    objectFit: 'contain',
  },
  academyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: BRAND,
  },
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    color: TEXT,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: MUTED,
  },
  sectionHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: BRAND,
    marginBottom: 6,
    marginTop: 2,
  },
  // Schedule table
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowEven: {
    backgroundColor: LIGHT,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: BRAND,
  },
  tableHeaderCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    color: WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 8.5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: TEXT,
  },
  colNum: { width: 20 },
  colMatch: { flex: 2 },
  colDate: { width: 82 },
  colTime: { width: 56 },
  colField: { width: 52 },
  colLocation: { flex: 2 },
  // Roster blocks
  gameBlock: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    overflow: 'hidden',
  },
  gameBlockHeader: {
    backgroundColor: BRAND,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameBlockTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: WHITE,
  },
  gameBlockMeta: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: 200,
  },
  gameBlockBody: {
    padding: 10,
  },
  playerCount: {
    fontSize: 7.5,
    color: MUTED,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerItem: {
    width: '33.33%',
    paddingVertical: 2,
    paddingRight: 6,
  },
  playerName: {
    fontSize: 8.5,
    color: TEXT,
  },
  playerNote: {
    fontSize: 7.5,
    color: MUTED,
    fontStyle: 'italic',
  },
  noPlayers: {
    fontSize: 8,
    color: MUTED,
    fontStyle: 'italic',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
  },
})

function Header({ academyName, logoUrl }: { academyName: string; logoUrl: string | null }) {
  return (
    <View style={s.header}>
      {logoUrl ? <Image style={s.logo} src={logoUrl} /> : null}
      <Text style={s.academyName}>{academyName}</Text>
    </View>
  )
}

function Footer({ label }: { label: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{label}</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  )
}

export function RosterPDF({ academyName, logoUrl, gameDayName, groupName, leadCoach, games }: RosterPDFProps) {
  const footerLabel = `${gameDayName} · ${groupName}${leadCoach ? ` · Lead: ${leadCoach}` : ''}`

  return (
    <Document>
      {/* Page 1 — Schedule */}
      <Page size="A4" style={s.page}>
        <Header academyName={academyName} logoUrl={logoUrl} />
        <View style={s.titleSection}>
          <Text style={s.pageTitle}>{gameDayName}</Text>
          <Text style={s.subtitle}>
            {groupName}{leadCoach ? `  ·  Lead Coach: ${leadCoach}` : ''}
          </Text>
        </View>
        <Text style={s.sectionHeading}>SCHEDULE</Text>
        <View style={s.table}>
          <View style={s.tableHeaderRow}>
            <Text style={[s.tableHeaderCell, s.colNum]}>#</Text>
            <Text style={[s.tableHeaderCell, s.colMatch]}>Match</Text>
            <Text style={[s.tableHeaderCell, s.colDate]}>Date</Text>
            <Text style={[s.tableHeaderCell, s.colTime]}>Time</Text>
            <Text style={[s.tableHeaderCell, s.colField]}>Field</Text>
            <Text style={[s.tableHeaderCell, s.colLocation]}>Location</Text>
          </View>
          {games.map((game, i) => (
            <View
              key={game.id}
              style={[s.tableRow, i % 2 === 1 ? s.tableRowEven : {}]}
            >
              <Text style={[s.tableCell, s.colNum]}>{game.index}</Text>
              <Text style={[s.tableCell, s.colMatch]}>
                {game.homeTeam} vs {game.awayTeam}
              </Text>
              <Text style={[s.tableCell, s.colDate]}>{game.date ?? '—'}</Text>
              <Text style={[s.tableCell, s.colTime]}>{game.time ?? '—'}</Text>
              <Text style={[s.tableCell, s.colField]}>{game.field ?? '—'}</Text>
              <Text style={[s.tableCell, s.colLocation]}>{game.location ?? '—'}</Text>
            </View>
          ))}
        </View>
        <Footer label={footerLabel} />
      </Page>

      {/* Page 2 — Rosters */}
      <Page size="A4" style={s.page}>
        <Header academyName={academyName} logoUrl={logoUrl} />
        <View style={s.titleSection}>
          <Text style={s.pageTitle}>Rosters</Text>
          <Text style={s.subtitle}>
            {groupName}{leadCoach ? `  ·  Lead Coach: ${leadCoach}` : ''}
          </Text>
        </View>
        {games.map((game) => {
          const meta = [game.date, game.time, game.field, game.location]
            .filter(Boolean)
            .join(' · ')
          return (
            <View key={game.id} style={s.gameBlock} wrap={false}>
              <View style={s.gameBlockHeader}>
                <Text style={s.gameBlockTitle}>
                  Game {game.index}: {game.homeTeam} vs {game.awayTeam}
                </Text>
                {meta ? <Text style={s.gameBlockMeta}>{meta}</Text> : null}
              </View>
              <View style={s.gameBlockBody}>
                {game.players.length === 0 ? (
                  <Text style={s.noPlayers}>No players assigned</Text>
                ) : (
                  <>
                    <Text style={s.playerCount}>{game.players.length} players</Text>
                    <View style={s.playerGrid}>
                      {game.players.map((p, j) => (
                        <View key={j} style={s.playerItem}>
                          <Text style={s.playerName}>
                            {j + 1}. {p.name}
                            {p.notes ? ` (${p.notes})` : ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          )
        })}
        <Footer label={footerLabel} />
      </Page>
    </Document>
  )
}
