import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  section: {
    margin: "10px",
  },
});

const ReportPDF = ({
  patientName,
  percentage,
  actions,
  emotions,
}: {
  patientName: string;
  percentage: any;
  actions: { [name: string]: number };
  emotions: { [name: string]: number };
}) => (
  <Document>
    <Page size={"A4"} style={styles.page}>
      <View style={styles.section}>
        <Text> Patient Name : {patientName} </Text>
      </View>
      <View style={styles.section}>
        <Text> Severity : {percentage}% </Text>
      </View>
      <View style={styles.section}>
        <Text> Actions </Text>
        {Object.entries(actions).map(([name, value], index) => (
          <Text key={index}>
            {name}: {value.toFixed(2)} seconds
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text> Emotions </Text>
        {Object.entries(emotions).map(([name, value], index) => (
          <Text key={index}>
            {name || "No emotion detected"}: {value.toFixed(2)} seconds
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
