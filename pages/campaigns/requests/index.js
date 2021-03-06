import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((_, index) => campaign.methods.requests(index).call())
    );

    return { campaign, address, requests, requestsCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />
    ));
  }

  render() {
    const { Header, Body, Row, HeaderCell } = Table;

    return (
      <Layout>
        <h2>Requests</h2>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 11 }}>
              Add Request
            </Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>

          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestsCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
